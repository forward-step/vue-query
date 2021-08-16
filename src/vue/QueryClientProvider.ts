/**
 * queryclient服务提供者
 */
import { defineComponent, inject, onMounted, onUnmounted, provide } from 'vue';
import { QueryClient } from '../core';

const symbol = Symbol('QueryClientProvider');

export const useQueryClient = () => {
    const queryClient = inject<QueryClient | undefined>(symbol, undefined);
    if (!queryClient) {
        throw new Error(
            'No QueryClient set, use QueryClientProvider to set one'
        );
    }
    return queryClient;
};

// 服务提供者
export const QueryClientProvider = defineComponent({
    name: 'QueryClientProvider',
    props: {
        client: {
            type: QueryClient,
            required: true,
        },
    },
    setup(props, { slots }) {

        provide(symbol, props.client);
        onMounted(() => {
            props.client.mount();
        });
        onUnmounted(() => {
            props.client.unmount();
        });

        return () => slots.default?.();
    },
});
