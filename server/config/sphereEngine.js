const problems = {
  get endpoint() {
    return '42cb0dca.problems.sphere-engine.com'
  },
  get accessToken() {
    return 'af9b16fbb7ef3cb3baa5a60ffc294da3'
  },
  checkStatusUrl({ submissionId }) {
    return `https://${this.endpoint}/api/v4/submissions/${submissionId}?access_token=${this.accessToken}`
  },
  get problemsUrl() {
    return `https://${this.endpoint}/api/v4/submissions?access_token=${this.accessToken}`
  }
}

const compilers = {
  get endpoint() {
    return '42cb0dca.compilers.sphere-engine.com'
  },
  get accessToken() {
    return '4e9d10a3d2f882a0f27d3ffc714b03a0'
  },
  get getCompilerListUrl() {
    return `https://${this.endpoint}/api/v4/compilers?access_token=${this.accessToken}`
  },
  getOutputUrl({ submissionId, stream }) {
    return `https://${this.endpoint}/api/v4/submissions/${submissionId}/${stream}?access_token=${this.accessToken}`
  },
  checkStatusUrl({ submissionId }) {
    return `https://${this.endpoint}/api/v4/submissions/${submissionId}?access_token=${this.accessToken}`
  },
  get compileUrl() {
    return `https://${this.endpoint}/api/v4/submissions?access_token=${this.accessToken}`
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
