import { StatsCard, StatsMapperConfig } from "@/app/core/models/common/card.model";


export function buildStatsCards<T>(items: T[], config: StatsMapperConfig<T>[]): StatsCard[] {
    return config.map(cfg => {
        const item = items.find(i => cfg.match?.(i));

        return {
            title: cfg.title,
            value: item ? cfg.getValue(item) : 'S/ 0.00',
            description: item ? cfg.getDescription?.(item) : undefined,
            icon: cfg.icon
        };
    });
}