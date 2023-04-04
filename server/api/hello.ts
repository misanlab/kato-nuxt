export default defineEventHandler((_event) => {
  const runtimeConfig = useRuntimeConfig();

  console.log(runtimeConfig.MONGODB_URI);
  return {
    api: "works",
  };
});
