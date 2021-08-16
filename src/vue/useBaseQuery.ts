import { onMounted, onUnmounted, reactive, watch } from 'vue';
import { QueryObserver } from '../core';
import { QueryKey, QueryObserverResult } from '../core/types';
import { useQueryClient } from './QueryClientProvider';
import { UseBaseQueryOptions } from './types';

function genArr(data: any): any[] {
    return Array.isArray(data) ? data : data == undefined ? [] : [data];
}

export function useBaseQuery<
    TQueryFnData,
    TError,
    TData,
    TQueryData,
    TQueryKey extends QueryKey
>(
    options: UseBaseQueryOptions<
        TQueryFnData,
        TError,
        TData,
        TQueryData,
        TQueryKey
    >,
    Observer: typeof QueryObserver
) {
    const queryClient = useQueryClient();
    const defaultedOptions = queryClient.defaultQueryObserverOptions(options);
    const observer = new Observer<
        TQueryFnData,
        TError,
        TData,
        TQueryData,
        TQueryKey
    >(queryClient, defaultedOptions);

    let result = reactive(observer.getCurrentResult()) as QueryObserverResult<
        TData,
        TError
    >;

    // 监听依赖项的变化
    watch(
        () => options.queryKey,
        () => {
            observer.setOptions(options); // 主要里面存在一个updateQuery方法
            observer.updateResult();
        },
        {
            deep: true,
        }
    );

    // 订阅数据的变化
    let unsubscribe: () => void;
    onMounted(() => {
        // Update result to make sure we did not miss any query updates
        // between creating the observer and subscribing to it.
        observer.updateResult();

        unsubscribe = observer.subscribe((res) => {
            Object.assign(result, res);
        });
    });
    onUnmounted(() => {
        unsubscribe?.();
    });

    return result;
}
