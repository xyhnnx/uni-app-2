<template>
	<view class="content">
		<NoData class="common-no-data-box" text="敬请期待"></NoData>
	</view>
</template>

<script>
	import NoData from '../../components/my-components/no-data'

	import {
		mapState,
		mapMutations
	} from 'vuex'
	import mInput from '../../components/m-input.vue'

	export default {
		components: {
			mInput,
			NoData
		},
		data() {
			return {
			}
		},
		computed: mapState(['forcedLogin']),
		methods: {
			...mapMutations(['login'])
		},
	}
</script>
<style scoped lang="scss">
</style>
