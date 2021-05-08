
const { env } = process;
export default {
  secrete: env.APP_SECRETE || 'newsecrete'
};
