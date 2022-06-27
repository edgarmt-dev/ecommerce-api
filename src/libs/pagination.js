function pagination(limit, page, model) {
    try {
        const total = await ProductModel.count()
        const totalPages = Math.ceil(total / limit)

        if (page > totalPages || page === 0) return {
            success: false,
            message: 'Page not found'
        }

        const skip = (page - 1) * limit
        const products = await ProductModel.find().skip(skip).limit(limit)

        const nextPage = `/api/products?${(page + 1)}`
        const prevPage = `/api/products?${(page - 1)}`

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