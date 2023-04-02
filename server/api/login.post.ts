export default eventHandler(async (event) => {
  const body = await readBody(event);
  // TODO: Handle body and add user
  return { updated: true };
});
