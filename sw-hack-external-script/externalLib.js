export async function retriveData() {
    const result = await isAuthenticated();
    if (!result)
        throw new Error('Unauthorized access');
    return { foo: 'bar' };
}
async function isAuthenticated() {
    // Represent backend calling
    return false;
}
