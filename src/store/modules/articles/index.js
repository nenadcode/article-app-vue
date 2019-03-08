import articlesApi from '../../../api/articles'
import commentsApi from '../../../api/comments'
import * as types from './mutation-types'
import * as alert from '../alert/mutation-types'

const state = {
  articles: null,
  filteredArticles: [],
  pagination: {
    totalPages: 1,
    currentPage: 1,
    resultsPerPage: 10
  },
  article: null,
  comments: [],
  comment: null
}

const getters = {
  allArticles: state => state.articles,
  filteredArticles: state => state.filteredArticles,
  allComments: state => state.comments,
  pagination: state => state.pagination,
  article: state => state.article,
  comment: state => state.comment
}

const actions = {
  getAllArticles ({ commit, dispatch }) {
    return articlesApi.getArticles()
      .then(articles => {
        let data = commit(types.RECEIVE_ARTICLES, { articles: articles.data })
        Promise.resolve(data)
          .then(() => {
            dispatch('setPaginationData', articles.data.length)
            dispatch('getFilteredArticles', 1)
          })
      })
      .catch(error => {
        commit(alert.SET_LOADING, false)
        commit(alert.SET_ERROR, error)
      })
  },
  getFilteredArticles ({ commit, state, dispatch }, page) {
    let allArticles = state.articles.map(article => article)
    let articles = allArticles.splice((page - 1) * 10, 10)
    dispatch('setArticleComments', articles)
    commit(types.SET_CURRENT_PAGE, page)
    commit(types.SET_FILTERED_ARTICLES, articles)
  },
  setPaginationData ({ commit, state }, page) {
    let totalPages = page / state.pagination.resultsPerPage
    commit(types.SET_TOTAL_PAGES, Math.ceil(totalPages))
  },
  postArticle ({ commit, dispatch }, { article }) {
    commit(alert.SET_LOADING, true)
    return articlesApi.postArticle(article)
      .then(article => {
        commit(alert.SET_LOADING, false)
        // dispatch('resetEditedArticle', article)
        return article
      })
      .catch(error => {
        commit(alert.SET_LOADING, false)
        commit(alert.SET_ERROR, error)
      })
  },
  editArticle ({ commit, dispatch }, { editedArticle }) {
    commit(alert.SET_LOADING, true)
    return articlesApi.editArticle(editedArticle)
      .then(editedArticle => {
        commit(alert.SET_LOADING, false)
        dispatch('newEditedArticle', editedArticle.data)
        return editedArticle
      })
      .catch(error => {
        commit(alert.SET_LOADING, false)
        commit(alert.SET_ERROR, error)
      })
  },
  newEditedArticle ({ commit, dispatch }, payload) {
    let newArticle = payload
    let comment = dispatch('getComments', {id: payload.id})
    Promise.resolve(comment)
      .then(response => {
        newArticle.comment = response.data
        commit(types.SET_EDITED_ARTICLE, newArticle)
      })
  },
  deleteArticle ({ commit }, { id }) {
    commit(alert.SET_LOADING, true)
    return articlesApi.deleteArticle({ id })
      .then(() => {
        commit(alert.SET_LOADING, false)
      })
      .catch(error => {
        commit(alert.SET_LOADING, false)
        commit(alert.SET_ERROR, error)
      })
  },
  getComments (context, { id }) {
    return commentsApi.getComments({ id })
      .then(data => {
        return data
      })
  },
  setArticleComments ({ commit, dispatch }, payload) {
    payload.map(article => {
      dispatch('getComments', { id: article.id })
        .then(res => {
          commit(types.SET_COMMENT, {id: article.id, comment: res.data})
        })
    })
  },
  postComment ({ commit }, payload) {
    commit(alert.SET_LOADING, true)
    let newComment = payload
    let dataComment = newComment.commentData
    return commentsApi.postComment({ id: newComment.id }, dataComment)
      .then(commentData => {
        commit(alert.SET_LOADING, false)
        return commentData
      })
      .catch(error => {
        commit(alert.SET_LOADING, false)
        commit(alert.SET_ERROR, error)
      })
  },
  editComment ({ commit, dispatch }, payload) {
    commit(alert.SET_LOADING, true)
    let newEditedComment = payload
    let dataEditedComment = newEditedComment.editedComment
    return commentsApi.editComment({ id: newEditedComment.id }, dataEditedComment)
      .then(() => {
        commit(alert.SET_LOADING, false)
        // dispatch('fetchEditedComment', newEditedComment)
        return newEditedComment
      })
      .catch(error => {
        commit(alert.SET_LOADING, false)
        commit(alert.SET_ERROR, error)
      })
  },
  fetchEditedComment ({ commit, dispatch }, payload) {
    let newComment = payload
    let comment = dispatch('getComments', { id: payload.id })
    Promise.resolve(comment)
      .then(response => {
        newComment = response.data
        commit(types.SET_EDITED_COMMENT, newComment)
      })
  },
  deleteComment ({ commit }, payload) {
    let articleId = payload.aid
    let commentId = payload.cid
    commit(alert.SET_LOADING, true)
    return commentsApi.deleteComment({ articleId, commentId })
      .then(() => {
        commit(alert.SET_LOADING, false)
      })
      .catch(error => {
        commit(alert.SET_LOADING, false)
        commit(alert.SET_ERROR, error)
      })
  }
}

const mutations = {
  [types.RECEIVE_ARTICLES] (state, { articles }) {
    state.articles = articles
  },
  [types.SET_FILTERED_ARTICLES] (state, articles) {
    state.filteredArticles = articles
  },
  [types.SET_TOTAL_PAGES] (state, page) {
    state.pagination.totalPages = page
  },
  [types.SET_CURRENT_PAGE] (state, page) {
    state.pagination.currentPage = page
  },
  [types.SET_RESULTS_PER_PAGE] (state, page) {
    state.pagination.resultsPerPage = page
  },
  [types.SET_EDITED_ARTICLE] (state, newArticle) {
    let articles = state.filteredArticles.map(article => {
      if (article.id === newArticle.id) {
        article = newArticle
      }
      return article
    })
    state.filteredArticles = articles
  },
  [types.SET_COMMENT] (state, { id, comment }) {
    let comments = state.filteredArticles.map(article => {
      if (article.id === id) {
        article.comment = comment
      }
      return article
    })
    state.filteredArticles = comments
  },
  [types.SET_EDITED_COMMENT] (state, newComment) {
    let articles = state.filteredArticles.map(article => {
      if (article.id === newComment.article) {
        article = newComment
      }
      return article
    })
    state.filteredArticles = articles
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
