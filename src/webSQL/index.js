const db = openDatabase('message', '1.0', 'storage message', 1024 * 1024 * 1024 * 1024 * 1024 * 1024)
const webSQL = {
    install(vue) {
        vue.config.globalProperties.$db = db
    }
}
export default {
    install(vue) {
        vue.config.globalProperties.$db = db
    }
}
