<template>
    <transition name="list-fade">
        <div class="playlist" v-show="showFlag" @click="hide">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h1 class="title">
                        <i class="icon" :class="iconMode" @click="changeMode"></i>
                        <span class="text">{{modeText}}</span>
                            <el-popconfirm title="是否清空播放列表" @confirm="confirmClear">
                                <el-button slot="reference"><i class="el-icon-delete"></i></el-button>
                            </el-popconfirm>
                    </h1>
                </div>
                <scroll ref="listContent" :data="sequenceList" class="list-content" :refreshDelay="refreshDelay">
                    <transition-group name="list" tag="ul">
                        <li ref="listItem" :key="item.name" class="item" v-for="(item, index) in sequenceList"
                            @click="selectItem(item, index)">
                            <i class="current" :class="getCurrentIcon(item)"></i>
                            <span class="text">{{ item.name }}</span>
                            <span class="like" @click.stop="toggleFavorite(item)">
                                <i :class="getFavoriteIcon(item)"></i>
                            </span>
                            <span class="delete" @click.stop="deleteOne(item)">
                                <i class="icon-delete"></i>
                            </span>
                        </li>
                    </transition-group>
                </scroll>
                <div class="list-operate">
                    <div class="add" @click="addSong">
                        <i class="icon-add"></i>
                        <span class="text">添加歌曲到队列</span>
                    </div>
                </div>
                <div class="list-close">
                    <span @click="hide">关闭</span>
                </div>
            </div>
            <add-song ref="addSong"></add-song>
        </div>
    </transition>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import Scroll from '../../base/scroll/scroll.vue'
import { currentSong } from '../../store/getters'
import { playMode } from '../../common/js/config';
import ElementUI from 'element-ui'
import AddSong from '../../components/add-song/add-song.vue'
import { playerMixin } from '../../common/js/mixin';
export default {
    mixins: [playerMixin],
    props: [],
    components: {
        Scroll,
        AddSong
    },
    data() {

        return {
            showFlag: false,
            refreshDelay:120
        }
    },
    methods: {
        show() {
            this.showFlag = true
            setTimeout(() => {
                this.$refs.listContent.refresh()
                this.scrollToCurrent(this.currentSong)
            }, 20)
        },
        hide() {
            this.showFlag = false
        },
        getCurrentIcon(item) {
            if (this.currentSong.name === item.name) {
                return 'icon-play'
            }
            return ''
        },
        selectItem(item, index) {
            if (this.mode === playMode.random) {
                index = this.playlist.findIndex((song) => {
                    return song.name === item.name
                })
            }
            this.setCurrentIndex(index)
            this.setPlayingState(true)
        },
        scrollToCurrent(current) {
            const index = this.sequenceList.findIndex((song) => {
                return current.name === song.name
            })
            this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
        },
        deleteOne(item) {
            this.deleteSong(item)
            if (!this.playlist.length) {
                this.hide()
            }
        },
        showConfirm() {
            this.$refs.confirm.show()
        },
        confirmClear() {
            this.deleteSongList()
            this.hide()
        },
        addSong(){
            this.$refs.addSong.show()
        },
        ...mapMutations({
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayingState: 'SET_PLAYING_STATE'
        }),
        ...mapActions([
            'deleteSong',
            'deleteSongList'
        ])
    },
    computed: {
        modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
      }
        // ...mapGetters([
        //     'sequenceList',
        //     'currentSong',
        //     'playlist',
        //     'mode'
        // ])
    },
    watch: {
        currentSong(newSong, oldSong) {
            if (!this.showFlag || newSong.name === oldSong.name) {
                return
            }
            this.scrollToCurrent(newSong)
        }
    },
    filters: {

    },
    beforeCreate() {

    },
    created() {

    },
    beforeMount() {

    },
    mounted() {

    },
    beforeUpdate() {

    },
    updated() {

    },
    beforeDestroy() {

    },
    destroy() {

    }
};
</script>
  
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/variable"
  @import "../../common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l

</style>
<style>
.el-button {
    background: #333 !important;
    border: none !important;
    padding: 0 !important;
    font-size: 15px !important;
}
</style>