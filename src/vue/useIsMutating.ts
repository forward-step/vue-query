import { onMounted, onUnmounted, Ref, ref } from 'vue';
import { notifyManager } from '../core/notifyManager';
import { MutationFilters } from '../core/utils';
import { useQueryClient } from './QueryClientProvider';

/**
 * 根据筛选获取当前突变的数量
 * @param filters 筛选条件
 * @returns 突变的数量
 */
export function useIsMutating(filters?: MutationFilters): Ref<number> {
    const queryClient = useQueryClient();
    const isMutating = ref(queryClient.isMutating(filters));

    // 订阅观察者
    let unsubscribe: () => void;
    onMounted(() => {
        unsubscribe = queryClient.getMutationCache().subscribe(() => {
            notifyManager.batchCalls(() => {
                const newIsMutating = queryClient.isMutating(filters);
                if (isMutating.value !== newIsMutating) {
                    isMutating.value = newIsMutating;
                }
            })();
        });
    });
    onUnmounted(() => {
        unsubscribe?.();
    });

    return isMutating;
}
