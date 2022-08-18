import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TourInfo } from '@/modules/tourInfos/entities';

@Injectable()
export class TourInfoService {
    constructor(
        @InjectRepository(TourInfo)
        private readonly tourInfoRepository: Repository<TourInfo>,
    ) {}

    public getAll(): Promise<TourInfo[]> {
        return this.tourInfoRepository.find();
    }

    public findById(id): Promise<TourInfo> {
        return this.tourInfoRepository.findOne({ where: { id } });
    }
}
