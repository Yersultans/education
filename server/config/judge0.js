const problems = {
  get endpoint() {
    return 'api.judge0.com'
  },
  get accessToken() {
    return ''
  },
  checkStatusUrl({ submissionId }) {
    return `https://${this.endpoint}/submissions/${submissionId}`
  },
  get problemsUrl() {
    return `https://${this.endpoint}/submissions`
  }
}

const compilers = {
  get endpoint() {
    return 'api.judge0.com'
  },
  get getCompilerListUrl() {
    return `https://${this.endpoint}/languages`
  },
  getOutputUrl({ submissionId, stream }) {
    return `https://${this.endpoint}/submissions/${submissionId}`
  },
  checkStatusUrl({ submissionId }) {
    return `https://${this.endpoint}/submissions/${submissionId}`
  },
  get compileUrl() {
    return `https://${this.endpoint}/submissions`
  }
}

const sphereEngine = {
  get problems() {
    return problems
  },
  get compilers() {
    return compilers
  }
}

module.exports = sphereEngine
