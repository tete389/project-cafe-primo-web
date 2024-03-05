// export const BaseURL = "https://employers-tanks-barriers-toy.trycloudflare.com"
//export const BaseURL = "http://localhost:8080"
export const BaseURL = import.meta.env.VITE_API
export const tokenRequest ="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJwcmluY2lwYWwiOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpJVXpJMU5pSjkiLCJyb2xlIjoiVVNFUiIsImlzcyI6IkJhY2tlbmRNYXAiLCJleHAiOjE2OTQ1MDk2MzJ9.oU6myAY9gPLdIsIUm95HVTOl5GO7zOQSbjWIbKeZGWM"

export const pageSize = "pageSize="
export const pageNum = "pageNum="

///// porduct Url
export const Product = "/product"
/// ProductBase Url
export const haveForm = "haveform=true"
export const haveFormName = "haveform=Name"
export const haveMinPriceIb = "minPrice=true"
export const haveCategory = "haveCate=true"
export const haveMateUse = "haveMateUse=true"
export const haveCountform = "haveCountform=true"
export const findProductBaseAll = `${Product}/getProductBase`
export const findProductBaseById = `${Product}/getProductBase?baseId=`
export const findProductBaseByCategoryId = `${Product}/getProductBase?cateId=`
export const updateProductBase = `${Product}/updateProductBase`
export const addBaseToCategory = `${Product}/updateIntoCategory`
export const deleteBaseFromCategory = `${Product}/deleteFormCategory`
export const createBaseProduct = `${Product}/createProductBase`
export const deleteProductBase = `${Product}/deleteProductBase`
export const uploadImage = `${Product}/uploadImage`


/// ProductForm Url
export const haveAddOn = "addOn=true"
export const haveOption = "option=true"
export const findProductFormAll = `${Product}/getProductForm`
export const findProductFormById = `${Product}/getProductForm?formId=`
export const findProductFormByBaseId = `${Product}/getProductForm?baseId=`
export const createFormProduct = `${Product}/createProductForm`
export const updateProductForm = `${Product}/updateProductForm`
export const deleteProductForm = `${Product}/deleteProductForm`

//// mate
export const Material = "/material"
export const findMaterialAll = `${Material}/getMaterial`
export const findMaterialById = `${Material}/getMaterial?mateId=`
export const createMaterial = `${Material}/createMaterial`
export const updateMaterial = `${Material}/updateMaterial`
export const deleteMaterial = `${Material}/deleteMaterial`  
// mate use
export const findMaterialUseByBaseId = `${Material}/getMaterialUse?baseId=`
export const findMaterialUseByFormId = `${Material}/getMaterialUse?formId=`
export const findMaterialUseByOptionId = `${Material}/getMaterialUse?optionId=`
export const findUseByMaterialId = `${Material}/getMaterialUse?mateId=`
export const createMaterialUsed = `${Material}/createMaterialUseInto`
export const deleteMaterialUsed = `${Material}/removeMaterialUseInto`


//// addOn
export const AddOn = "/addOn"
export const haveAddOnOption = "/option?="
export const findAddOnAll = `${AddOn}/getAddOn`
export const createAddOn = `${AddOn}/createAddOn`
export const updateAddOn = `${AddOn}/updateAddOn`
export const deleteAddOn = `${AddOn}/deleteAddOn`
export const findAddOnById = `${AddOn}/getAddOn?addId=`
export const findAddOnByFormId = `${AddOn}/getAddOn?formId=`
export const updateToProductForm = `${AddOn}/updateIntoProductForm`
export const deleteFromProductForm = `${AddOn}/deleteFromProductForm`

/// option
export const Option = "/addOn/option"
export const findOptionAll = `${Option}/getOption`
export const createOption = `${Option}/createOption`
export const updateOption = `${Option}/updateOption`
export const deleteOption = `${Option}/deleteOption`
export const findOptionById = `${Option}/getOption?optionId=`
export const findOptionByAddOnId = `${Option}/getOption?addOnId=`





///// category Url
export const Category = "/category"
export const haveBase = "base=true"
export const haveMinPriceIc = "minPrice=true"
export const findCategoryAll = `${Category}/getCategory`
export const findCategoryById = `${Category}/getCategory?cateId=`
export const updateCategory = `${Category}/updateCategory`
export const createCategory = `${Category}/createCategory`
export const deleteCategory = `${Category}/deleteCategory`




///// order Url
export const orderId = `?orderId=`
export const haveIncome = `&income=true`
export const requestOrder = `/order/createOrder`
export const haveOrderDetail = `orderDetail=true`
export const findOrderById = `/order/getOrderById${orderId}`
export const findOrderByIdList = `/order/getOrderByListId`
export const updateOrder = `/order/updateProductInOrder`
export const getNotifications = `/order/getEmployeeNotifications`
export const getNotificationsCustomer = `/order/getCustomerNotifications`
/// resqust token
export const updateStatusOrder = `/order/updateStatusOrder`
export const deleteOder = `/order/deleteOder`
/////////recent
// request
export const dateStart = `dateStart=`
export const dateEnd = `dateEnd=`
export const statusOrder = `&status=` /// Wait Payment , All , 
// not request
export const findRecentOrder = `/order/getRecentOrder`
export const findRecentProduct = `${findRecentOrder}?recentProduct=true`
export const findRecentOption = `${findRecentOrder}?recentOption=true`
export const findRecentMaterial= `${findRecentOrder}?recentMaterial=true`
export const findRecentOrderDetailAll = `${findRecentMaterial}&recentProduct=true&recentOption=true`




///// point Url
export const point = "/customer"
export const findPoint = `${point}/getPoint?phoneNumber=`
export const collectPoint = `${point}/collectPoints`
export const spendPoint = `${point}/spendPoint`

///// emp Url
export const emp = "/employee"
export const findSettingShop = `${emp}/getSetting`
export const updateSettingShop = `${emp}/updateSetting`
export const empLogIn = `${emp}/login`