<template>
	<view class="content">
		<view class="btn-row">
			商城
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'

	export default {
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
