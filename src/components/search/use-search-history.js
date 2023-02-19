import { SEARCH_KEY } from '@/assets/js/constant'
import { save, remove, clear } from '@/assets/js/array-store'
import { useStore } from 'vuex'

export default function useSearchHistory() {
    const maxLen = 200
    const store = useStore()

    function saveSearchQuery(query) {
        const searchHistory = save(query, SEARCH_KEY, (item) => {
            return item === query
        }, maxLen)
        store.commit('setSearchHistory', searchHistory)
    }
    function deleteSearch(query) {
        const searchHistory = remove(SEARCH_KEY, (item) => {
            return item === query
        })
        store.commit('setSearchHistory', searchHistory)
    }
    function clearSearch() {
        const searchHistory = clear(SEARCH_KEY)
        store.commit('setSearchHistory', searchHistory)
    }
    return {
        saveSearchQuery,
        deleteSearch,
        clearSearch
    }
}
