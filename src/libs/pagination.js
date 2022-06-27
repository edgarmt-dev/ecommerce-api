async function pagination(limit, page, model) {
    try {
        const total = await model.count()
        const totalPages = Math.ceil(total / limit)

        if (page > totalPages || page === 0) return {
            success: false,
            message: 'Page not found'
        }

        const skip = (page - 1) * limit
        const products = await model.find().skip(skip).limit(limit)

        const prevPage = page - 1 != 0 || isNaN(page) ? null : `/api/products?${(page - 1)}`
        const nextPage = totalPages < 2 ? null : `/api/products?${(page + 1)}`

        return {
            success: true,
            products,
            totalProducts: total,
            totalPages,
            prevPage,
            nextPage
        }
    } catch (error) {
        return {
            success: false,
            error
        }
    }
}

module.exports = pagination