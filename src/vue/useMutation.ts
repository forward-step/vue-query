import { onMounted, onUnmounted, reactive, watchEffect, toRefs } from 'vue';
import { noop, parseMutationArgs } from '../core/utils';
import { MutationObserver } from '../core/mutationObserver';
import { useQueryClient } from './QueryClientProvider';
import {
    UseMutateFunction,
    UseMutationOptions,
    UseMutationResult,
} from './types';
import {
    MutationFunction,
    MutationKey,
    MutationObserverResult,
} from '../core/types';

// HOOK

export function useMutation<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown
>(
    options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext>;
export function useMutation<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown
>(
    mutationFn: MutationFunction<TData, TVariables>,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext>;
export function useMutation<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown
>(
    mutationKey: MutationKey,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext>;
export function useMutation<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown
>(
    mutationKey: MutationKey,
    mutationFn?: MutationFunction<TData, TVariables>,
    options?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext>;
export function useMutation<
    TData = unknown,
    TError = unknown,
    TVariables = void,
    TContext = unknown
>(
    arg1:
        | MutationKey
        | MutationFunction<TData, TVariables>
        | UseMutationOptions<TData, TError, TVariables, TContext>,
    arg2?:
        | MutationFunction<TData, TVariables>
        | UseMutationOptions<TData, TError, TVariables, TContext>,
    arg3?: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
    const options = parseMutationArgs(arg1, arg2, arg3);
    const queryClient = useQueryClient();
    const observer = new MutationObserver<TData, TError, TVariables, TContext>(
        queryClient,
        options
    );

    watchEffect(() => {
        const options = parseMutationArgs(arg1, arg2, arg3);
        observer.setOptions(options);
    });

    const currentResult = reactive(
        observer.getCurrentResult()
    ) as MutationObserverResult<TData, TError, TVariables, TContext>;

    // 订阅数据的变化
    let unsubscribe: () => void;
    onMounted(() => {
        unsubscribe = observer.subscribe((res) => {
            Object.assign(currentResult, res);
        });
    });
    onUnmounted(() => {
        unsubscribe?.();
    });

    // 突变函数
    const mutate: UseMutateFunction<TData, TError, TVariables, TContext> = (
        variables,
        mutateOptions
    ) => {
        observer.mutate(variables, mutateOptions).catch(noop);
    };

    return {
        ...toRefs(currentResult),
        mutate,
        mutateAsync: currentResult.mutate,
    } as any;
}
