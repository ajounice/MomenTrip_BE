import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TourInfo } from '@/modules/tourInfos/entities';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

interface IKakaoDocument {
    place_name: string;
    distance: string;
    place_url: string;
    category_name: string;
    address_name: string;
    road_address_name: string;
    id: string;
    phone: string;
    category_group_code: string;
    category_group_name: string;
    x: string;
    y: string;
}

interface IKakaoMeta {
    same_name: { region: string[]; keyword: string; selected_region: string };
    pageable_count: number;
    total_count: number;
    is_end: boolean;
}

interface IKakaoLocalResult {
    data: { documents: IKakaoDocument[]; meta: IKakaoMeta };
}

@Injectable()
export class TourInfoService {
    constructor(
        @InjectRepository(TourInfo)
        private readonly tourInfoRepository: Repository<TourInfo>,
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    public getAll(): Promise<TourInfo[]> {
        return this.tourInfoRepository.find();
    }

    public findById(id: number): Promise<TourInfo> {
        return this.tourInfoRepository.findOne({ where: { id } });
    }

    public findByName(name): Promise<TourInfo> {
        return this.tourInfoRepository.findOne({ where: { name } });
    }

    public async getImageByIds(ids: number[]): Promise<string[]> {
        const data = await this.tourInfoRepository.find({ where: { id: In(ids) } });

        return data.map((info) => info.image);
    }

    public async createInfo(site) {
        const openAPIURL = this.configService.get<string>('OPENAPI_URL');
        const openAPIServiceKey = this.configService.get<string>('OPENAPI_SERVICE_KEY');
        const kakaoLocalURL = this.configService.get<string>('KAKAO_LOCAL_URL');
        const kakaoAPIKey = this.configService.get<string>('KAKAO_KEY');

        const kakaoRequestURL = `${kakaoLocalURL}?query=${encodeURIComponent(site)}`;

        const kakaoAPISearchResult: IKakaoLocalResult = await lastValueFrom(
            this.httpService.get(kakaoRequestURL, {
                headers: { Authorization: `KakaoAK ${kakaoAPIKey}` },
            }),
        );

        const document = kakaoAPISearchResult.data.documents[0];

        const openAPIRequestURL = `${openAPIURL}/locationBasedList?numOfRows=10&MobileOS=ETC&MobileApp=Momentrip&serviceKey=${encodeURIComponent(
            openAPIServiceKey,
        )}&_type=json&mapX=${document.x}&mapY=${document.y}&radius=500&contentTypeId=12`;

        const openAPISearchResult = await lastValueFrom(
            this.httpService.get(openAPIRequestURL, {
                responseType: 'json',
            }),
        );

        const openAPIItems = this.filterOpenAPIItem(
            openAPISearchResult?.data?.response?.body?.items?.item,
            document.place_name,
        );

        const result = await this.tourInfoRepository
            .createQueryBuilder()
            .insert()
            .values({
                name: site,
                image: openAPIItems.length ? openAPIItems[0].firstimage : '',
                place: () => `ST_GeomFromText('POINT(${document.x} ${document.y})')`,
            })
            .execute();

        return this.tourInfoRepository.findOne({ where: { id: result.identifiers[0].id } });
    }

    private filterOpenAPIItem = (data, site) => {
        if (!data) {
            return [];
        }
        return data.filter((v) => v.title.includes(site));
    };
}
