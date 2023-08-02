export const BaseURL = "https://addition-denied-std-fifty.trycloudflare.com"

///// porduct Url
export const Product = "/product"
/// ProductBase Url
export const haveForm = "form=true"
export const haveMinPriceIb = "minPrice=true"
export const findProductBaseAll = `${Product}/getProductBase`
export const findProductBaseById = `${Product}/getProductBase/?baseId=`
export const findProductBaseByCategoryId = `${Product}/getProductBase/?cateId=`
/// ProductForm Url
export const haveAddOn = "addOn=true"
export const haveOption = "option=true"
export const findProductFormAll = `${Product}/getProductForm`
export const findProductFormById = `${Product}/getProductForm/?formId=`
export const findProductFormByBaseId = `${Product}/getProductForm/?baseId=`


///// category Url
export const Category = "/category"
export const haveBase = "base=true"
export const haveMinPriceIc = "minPrice=true"
export const findCategoryAll = `${Category}/getCategory`
export const findCategoryById = `${Category}/getCategory/?cateId=`

