import { QueryObserver } from '..';
import { QueryFunction, QueryKey } from '../core/types';
import { parseQueryArgs } from '../core/utils';
import { UseQueryOptions, UseQueryResult } from './types';
import { useBaseQuery } from './useBaseQuery';

/// useQuery
export function useQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData
>(
    options: UseQueryOptions<TQueryFnData, TError, TData>
): UseQueryResult<TData, TError>;
export function useQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData
>(
    queryKey: QueryKey,
    options?: UseQueryOptions<TQueryFnData, TError, TData>
): UseQueryResult<TData, TError>;
export function useQuery<
    TQueryFnData = unknown,
    TError = unknown,
    TData = TQueryFnData
>(
    queryKey: QueryKey,
    queryFn: QueryFunction<TQueryFnData>,
    options?: UseQueryOptions<TQueryFnData, TError, TData>
): UseQueryResult<TData, TError>;
export function useQuery<TQueryFnData, TError, TData = TQueryFnData>(
    arg1: QueryKey | UseQueryOptions<TQueryFnData, TError, TData>,
    arg2?:
        | QueryFunction<TQueryFnData>
        | UseQueryOptions<TQueryFnData, TError, TData>,
    arg3?: UseQueryOptions<TQueryFnData, TError, TData>
): UseQueryResult<TData, TError> {
    return useBaseQuery(parseQueryArgs(arg1, arg2, arg3), QueryObserver);
}