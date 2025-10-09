import { INewsletter } from "./newsletter.interface"
import { Newsletter } from "./newsletter.modle"

// create newsletter
export const createNewsletter = async (data: INewsletter) => {
  const newsletter = await Newsletter.create(data)
  return newsletter
}

// get all newsletters
export const getAllNewsletters = async () => {
  const newsletters = await Newsletter.find()
  return newsletters
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