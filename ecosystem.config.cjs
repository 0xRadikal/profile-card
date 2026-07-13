module.exports = {
  apps: [{
    name: 'profile-card',
    script: 'test/serve.mjs',
    interpreter: 'node',
    args: '',
    env: { PORT: 3000 },
    watch: false, instances: 1, exec_mode: 'fork'
  }]
}
