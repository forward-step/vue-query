import { onMounted, onUnmounted, Ref, ref } from 'vue';
import { notifyManager } from '../core/notifyManager';
import { QueryKey } from '../core/types';
import { parseFilterArgs, QueryFilters } from '../core/utils';
import { useQueryClient } from './QueryClientProvider';

/**
 * 查询QueryCache中查询请求的数量
 */
export function useIsFetching(filters?: QueryFilters): Ref<number>;
export function useIsFetching(
    queryKey?: QueryKey,
    filters?: QueryFilters
): Ref<number>;
export function useIsFetching(
    arg1?: QueryKey | QueryFilters,
    arg2?: QueryFilters
): Ref<number> {
    const queryClient = useQueryClient();
    const [filters] = parseFilterArgs(arg1, arg2);
    const isFetching = ref(queryClient.isFetching(filters));

    // 订阅观察者
    let unsubscribe: () => void;
    onMounted(() => {
        unsubscribe = queryClient.getQueryCache().subscribe((res) => {
            const newIsFetching = queryClient.isFetching(filters);
            if (isFetching.value !== newIsFetching) {
                isFetching.value = newIsFetching;
            }
        });
    });
    onUnmounted(() => {
        unsubscribe?.();
    });

    return isFetching;
}
