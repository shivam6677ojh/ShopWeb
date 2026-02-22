export const DisplayPriceInRupees = (price) => {
    const numericPrice = Number(price)
    if (!Number.isFinite(numericPrice)) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(0)
    }

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(numericPrice)
}