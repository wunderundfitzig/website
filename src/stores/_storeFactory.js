'use strict'

import Hover from 'hover'
import mainStore from './mainStore'
import creativesStore from './creativesStore'
import newsStore from './newsStore'
import storyStore from './storyStore'
import privacyStore from './privacyStore'

export const createStore = ({ initialData = {} } = {}) => {
  return Hover.compose({
    main: Hover(mainStore.actions, initialData.main || mainStore.initialState),
    creatives: Hover(creativesStore.actions, initialData.creatives ||
                     creativesStore.initialState),
    news: Hover(newsStore.actions, initialData.news || newsStore.initialState),
    stories: Hover(storyStore.actions, initialData.stories ||
                   storyStore.initialState),
    privacyInfo: Hover(privacyStore.actions, initialData.privacyInfo ||
                       privacyStore.initialState)
  })
}

export default { createStore }
