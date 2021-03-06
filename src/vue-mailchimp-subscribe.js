import jsonp from 'jsonp'
import queryString from 'query-string'

export default {
    mounted() {
        console.log('Mounted')
    },
    props: {
        url: {
            required: true,
            type: String,
        },

        userId: {
            required: true,
            type: String,
        },

        listId: {
            required: true,
            type: String,
        },
    },

    data() {
        return {
            email: null,
            name: null,
            message: null,
            success: false,
            error: null,
            loading: false,
        }
    },

    computed: {
        data() {
            return queryString.stringify({
                u: this.userId,
                id: this.listId,
                EMAIL: this.email,
                FNAME: this.name,
                MESSASGE: this.message
            })
        },
    },

    methods: {
        setEmail(value = '') {
            this.email = value.trim()
        },
        setName(value = '') {
            this.name = value.trim()
        },
        setMessage(value = '') {
            this.messsage = value.trim()
        },

        subscribe() {
            if (this.email === null || this.name === null || this.message === null || this.loading) {
                return
            }

            this.success = false
            this.error = null
            this.loading = true

            const url = `${this.url}?${this.data}`

            jsonp(url, { param: 'c' }, this.onResponse)
        },

        onResponse(error, data) {
            this.loading = false

            if (error) {
                this.error = error
            }

            if (data && data.result === 'error') {
                this.error = this.formatErrorMessage(data.msg)
            }

            if (this.error) {
                this.$emit('error', this.error)
            } else {
                this.success = true
                this.email = null
                this.name = null
                this.message = null
                this.$emit('success')
            }
        },

        formatErrorMessage(message) {
            return message.replace('0 - ', '')
        },
    },

    render() {
        return this.$scopedSlots.default({
            subscribe: this.subscribe,
            setEmail: this.setEmail,
            setName: this.setName,
            setMessage: this.setMessage,
            error: this.error,
            success: this.success,
            loading: this.loading,
        })
    },
}
