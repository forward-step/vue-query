<template>
    <div className="App">
        <p>
            悬停在一个字符将预取它，当它被预取时，它将变成<strong>粗体</strong>点击预取字符将显示他们的统计数据如下。
        </p>
        <h2>Characters</h2>
        <div v-if="charactersQuery.isLoading">Loading...</div>
        <ul v-else>
            <li
                v-for="item in charactersQuery.data"
                :key="item.id"
                @click="setSelectedChar(item.id)"
                @mouseenter="prefetchSelectedChar(item.id)"
            >
                <div
                    :key="forceUpdateChars"
                    :style="
                        queryClient.getQueryData(['character', item.id])
                            ? {
                                  fontWeight: 'bold',
                              }
                            : ''
                    "
                >
                    {{ item.id }} - {{ item.name }}
                </div>
            </li>
        </ul>
        <h3>选择的字符-{{ selectedChar }}</h3>
        <div v-if="characterQuery.isLoading">Loading...</div>
        <pre v-else>{{ characterQuery.data }}</pre>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQueryClient, useQuery } from '@/vue-query';

/// 请求数据

const getCharacters = async () => {
    return await new Promise((r) => setTimeout(r, 5000)).then(() => {
        return Array.from({ length: 10 }, (item, index) => {
            return {
                id: index,
                name: `data-${index}`,
            };
        });
    });
};

const getCharacter = async (id: number) => {
    return await new Promise((r) => setTimeout(r, 5000)).then(() => {
        console.info('请求', id);
        return {
            parentid: id,
            name: `data-${id}-son`,
        };
    });
};

export default defineComponent(() => {
    const queryClient = useQueryClient();
    const forceUpdateChars = ref<number>(0);
    const selectedChar = ref<number>(1);
    const charactersQuery = useQuery('characters', getCharacters);
    const characterQuery = useQuery(['character', selectedChar], () => {
        return getCharacter(selectedChar.value!);
    });
    const setSelectedChar = (id: number) => (selectedChar.value = id);
    const prefetchSelectedChar = (id: number) => {
        queryClient.prefetchQuery(['character', id], () => getCharacter(id), {
            staleTime: 10 * 1000, // 超过10s才会预加载
        });
        // TODO: 刷新vue组件
        // forceUpdateChars.value++;
    };
    return {
        charactersQuery,
        characterQuery,
        setSelectedChar,
        queryClient,
        prefetchSelectedChar,
        forceUpdateChars,
        selectedChar,
    };
});
</script>
