import { z } from 'zod'

const url = process.env.HYPER || 'https://play.hyper63.com'
const token = process.env.TOKEN

const Review = z.object({
  id: z.string().optional(),
  title: z.string(),
  body: z.string(),
  rating: z.number().max(5)
})

export default async function (req, res) {
  const { success, data, error } = Review.safeParse(req.body)
  if (!success) { return res.status(500).json({ error: error.issues}) }

  const result = await fetch(url + '/data/movie-reviews', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }).then(res => {
    if (res.status !== 201) {
      return ({ok: false, status: res.status, msg: 'error with service'})
    }
    return res.json()
  }).catch(err => ({ok: false, status: 500, msg: err.message}))

  res.status(result.status || 201).json(result)
}
