import {playMode} from '../common/js/config'
import {loadSearch, loadPlay, loadFavorite} from '../common/js/cache'

const state = {
    singer:{},
    playing:false,
    fullScreen:false,
    playlist:[],
    sequenceList:[],
    mode:playMode.sequence,
    currentIndex:-1,
    disc: {},
    topList:{},
    playHistory:loadPlay(),
    favoriteList:loadFavorite()
}
export default state