# Vue Query

Hooks for fetching, caching and updating asynchronous data in Vue.

# documentation

保持与react-query一样的API

Visit [https://react-query.tanstack.com/](https://react-query.tanstack.com/)

# Quick sTART

1. Attach Vue Query to the root component of your Vue application

```vue
<template>
    <query-client-provider :client="queryClient">
        <router-view />
    </query-client-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { QueryClientProvider, QueryClient } from '@/vue-query';
const queryClient = new QueryClient();
queryClient.setDefaultOptions();
export default defineComponent({
    name: 'APP',
    components: {
        QueryClientProvider,
    },
    setup() {
        return {
            queryClient,
        };
    },
});
</script>
```

2. Use query and search projects to demonstrate

```tsx
function useSearchProjects() {
    const searchValue = useQueryString('search');
    const debounceSearchValue = useDebounce(searchValue);
    const personId = useQueryString('personId');
    const result = useQuery<IProject[]>(
        ['projects', debounceSearchValue, personId],
        () => {
            return window.fetch('/projects', {
                data: {
                    search: debounceSearchValue.value,
                    personId: personId.value,
                },
            });
        }
    );
    return [
        result,
        {
            searchValue,
            personId,
        },
    ] as const;
}
```
