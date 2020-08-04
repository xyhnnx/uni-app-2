<template>
	<view class="common-no-data-box">
		<no-data text="敬请期待"></no-data>
	</view>
</template>

<script>
	import NoData from '../../components/my-components/no-data'

	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
		components: {
			NoData
		},
		computed: {
			...mapState(['hasLogin', 'forcedLogin'])
		},
		methods: {
			...mapMutations(['logout']),
		}
	}
</script>

<style>

</style>
