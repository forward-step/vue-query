import { onMounted, onUnmounted, reactive, watchEffect } from 'vue';
import { QueriesObserver } from '../core/queriesObserver';
import { useQueryClient } from './QueryClientProvider';
import { UseQueryOptions, UseQueryResult } from './types';

/**
 * 批量使用useQuery
 */
export function useQueries(queries: UseQueryOptions[]): UseQueryResult[] {
    const queryClient = useQueryClient();

    const defaultedQueries = queries.map((options) => {
        const defaultedOptions = queryClient.defaultQueryObserverOptions(
            options
        );
        // Make sure the results are already in fetching state before subscribing or updating options
        defaultedOptions.optimisticResults = true;
        return defaultedOptions;
    });

    const observer = new QueriesObserver(queryClient, defaultedQueries);

    const result = reactive(observer.getOptimisticResult(defaultedQueries));

    // 订阅数据的变化
    let unsubscribe: () => void;
    onMounted(() => {
        unsubscribe = observer.subscribe((res) => {
            Object.assign(result, res);
        });
    });
    onUnmounted(() => {
        unsubscribe?.();
    });

    watchEffect(() => {
        // Do not notify on updates because of changes in the options because
        // these changes should already be reflected in the optimistic result.
        observer.setQueries(defaultedQueries, { listeners: false });
    });

    return result;
}
