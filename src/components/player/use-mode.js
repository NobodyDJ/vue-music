import { PLAY_MODE } from '@/assets/js/constant'
import { computed } from 'vue'
import { useStore } from 'vuex'
export default function useMode() {
    const store = useStore()
    const playMode = computed(() => store.state.playMode)

    const modeIcon = computed(() => {
        return playMode.value === PLAY_MODE.sequence ? 'icon-sequence' : playMode.value === PLAY_MODE.random ? 'icon-random' : 'icon-loop'
    })
    function changeMode() {
        const mode = (playMode.value + 1) % 3
        store.dispatch('changeMode', mode)
    }

    return {
        modeIcon,
        changeMode
    }
}
