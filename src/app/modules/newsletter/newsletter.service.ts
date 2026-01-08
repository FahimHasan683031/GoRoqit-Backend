import QueryBuilder from "../../builder/QueryBuilder"
import { INewsletter } from "./newsletter.interface"
import { Newsletter } from "./newsletter.modle"

// create newsletter
export const createNewsletter = async (data: INewsletter) => {
  const newsletter = await Newsletter.create(data)
  return newsletter
}

// get all newsletters
export const getAllNewsletters = async (query: Record<string, unknown>) => {
  const newsletterQuery = new QueryBuilder(Newsletter.find(), query)
    .search(['email'])
    .filter()
    .paginate()

  const newsletters = await newsletterQuery.modelQuery
  const pagenateInfo = await newsletterQuery.getPaginationInfo()
  return {
    newsletters,
    meta:pagenateInfo,
  }
}
// delete newsletter
export const deleteNewsletter = async (id: string) => {
  const newsletter = await Newsletter.findByIdAndDelete(id)
  return newsletter
}
// delete all newsletters
export const deleteAllNewsletters = async () => {
  const newsletters = await Newsletter.deleteMany()
  return newsletters
}

export const newsletterService = {
  createNewsletter,
  getAllNewsletters,
  deleteNewsletter,
  deleteAllNewsletters,
}