import { Button } from '~/components/button'
import { DividerHeading } from '~/components/divider-heading'
import { Input } from '~/components/input'
import { Label } from '~/components/label'
import { Link } from '~/components/link'
import { Select } from '~/components/select'
import { Textarea } from '~/components/textarea'

export default function Index() {
  return (
    <div className="mx-auto mt-20 w-full max-w-3xl p-6 lg:mt-32">
      <div className="absolute left-6 top-4 lg:left-8 lg:top-6">
        <Link className="text-sm font-medium text-gray-500" to="/">
          ← Home
        </Link>
      </div>
      <h1 className="text-5xl font-semibold tracking-tight">Design system</h1>
      <p className="mt-3 text-balance text-gray-500">
        The source of truth for colors, typography and UI components.
      </p>
      <div className="my-24 grid gap-24">
        {/* Colors */}
        <div>
          <DividerHeading as={'h2'}>Colors</DividerHeading>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div>
              <div className="aspect-video bg-gray-100 shadow-[inset_0_0_0_1px] shadow-black/10 dark:shadow-white/10"></div>
              <div className="mt-2 flex justify-between gap-1 text-xs">
                <span>gray-100</span>
              </div>
            </div>
            <div>
              <div className="aspect-video bg-gray-200 shadow-[inset_0_0_0_1px] shadow-black/10 dark:shadow-white/10"></div>
              <div className="mt-2 flex justify-between gap-1 text-xs">
                <span>gray-200</span>
              </div>
            </div>
            <div>
              <div className="aspect-video bg-gray-300 shadow-[inset_0_0_0_1px] shadow-black/10 dark:shadow-white/10"></div>
              <div className="mt-2 flex justify-between gap-1 text-xs">
                <span>gray-300</span>
              </div>
            </div>
            <div>
              <div className="aspect-video bg-gray-400 text-gray-500 shadow-[inset_0_0_0_1px] shadow-black/10 dark:shadow-white/10"></div>
              <div className="mt-2 flex justify-between gap-1 text-xs">
                <span>gray-400</span>
              </div>
            </div>
            <div>
              <div className="aspect-video bg-gray-500 shadow-[inset_0_0_0_1px] shadow-black/10 dark:shadow-white/10"></div>
              <div className="mt-2 flex justify-between gap-1 text-xs">
                <span>gray-500</span>
              </div>
            </div>
            <div>
              <div className="aspect-video bg-gray-600 shadow-[inset_0_0_0_1px] shadow-black/10 dark:shadow-white/10"></div>
              <div className="mt-2 flex justify-between gap-1 text-xs">
                <span>gray-600</span>
              </div>
            </div>
            <div>
              <div className="aspect-video bg-gray-700 shadow-[inset_0_0_0_1px] shadow-black/10 dark:shadow-white/10"></div>
              <div className="mt-2 flex justify-between gap-1 text-xs">
                <span>gray-700</span>
              </div>
            </div>
            <div>
              <div className="aspect-video bg-gray-800 shadow-[inset_0_0_0_1px] shadow-black/10 dark:shadow-white/10"></div>
              <div className="mt-2 flex justify-between gap-1 text-xs">
                <span>gray-800</span>
              </div>
            </div>
            <div>
              <div className="aspect-video bg-gray-900 shadow-[inset_0_0_0_1px] shadow-black/10 dark:shadow-white/10"></div>
              <div className="mt-2 flex justify-between gap-1 text-xs">
                <span>gray-900</span>
              </div>
            </div>
            <div>
              <div className="aspect-video bg-gray-950 shadow-[inset_0_0_0_1px] shadow-black/10 dark:shadow-white/10"></div>
              <div className="mt-2 flex justify-between gap-1 text-xs">
                <span>gray-950</span>
              </div>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div>
          <DividerHeading as={'h2'}>Typography</DividerHeading>
          <div className="mt-12 space-y-8">
            <div className="grid items-baseline gap-2 md:grid-cols-3">
              <h1 className="text-5xl font-semibold tracking-tight">Display</h1>
              <div className="text-sm text-gray-500 md:text-center">48px / 48px / 600</div>
              <div className="flex flex-wrap gap-1 md:justify-end">
                <code className="bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  text-5xl
                </code>
                <code className="bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  font-semibold
                </code>
                <code className="bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  tracking-tight
                </code>
              </div>
            </div>

            <div className="grid items-baseline gap-2 md:grid-cols-3">
              <h1 className="text-3xl font-semibold tracking-tight">Heading 1</h1>
              <div className="text-sm text-gray-500 md:text-center">30px / 36px / 600</div>
              <div className="flex flex-wrap gap-1 md:justify-end">
                <code className="bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  text-3xl
                </code>
                <code className="bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  font-semibold
                </code>
                <code className="bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  tracking-tight
                </code>
              </div>
            </div>

            <div className="grid items-baseline gap-2 md:grid-cols-3">
              <h1 className="text-2xl font-semibold">Heading 2</h1>
              <div className="text-sm text-gray-500 md:text-center">24px / 32px / 600</div>
              <div className="flex flex-wrap gap-1 md:justify-end">
                <code className="bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  text-2xl
                </code>
                <code className="bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  font-semibold
                </code>
              </div>
            </div>

            <div className="grid items-baseline gap-2 md:grid-cols-3">
              <h1 className="text-xl font-semibold">Heading 3</h1>
              <div className="text-sm text-gray-500 md:text-center">20px / 28px / 600</div>
              <div className="flex flex-wrap gap-1 md:justify-end">
                <code className="bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  text-xl
                </code>
                <code className="bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  font-semibold
                </code>
              </div>
            </div>

            <div className="grid items-baseline gap-2 md:grid-cols-3">
              <p>Text base</p>
              <div className="text-sm text-gray-500 md:text-center">16px / 24px / 400</div>
              <div className="flex flex-wrap gap-1 md:justify-end">
                <code className="bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  text-base
                </code>
              </div>
            </div>

            <div className="grid items-baseline gap-2 md:grid-cols-3">
              <p className="text-gray-600 dark:text-gray-400">Text muted</p>
              <div className="text-sm text-gray-500 md:text-center">16px / 24px / 400</div>
              <div className="flex flex-wrap gap-1 md:justify-end">
                <code className="bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  text-gray-600
                </code>
                <code className="bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  dark:text-gray-400
                </code>
              </div>
            </div>

            <div className="grid items-baseline gap-2 md:grid-cols-3">
              <p className="text-gray-500">Text faint</p>
              <div className="text-sm text-gray-500 md:text-center">16px / 24px / 400</div>
              <div className="flex flex-wrap gap-1 md:justify-end">
                <code className="bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  text-gray-500
                </code>
              </div>
            </div>

            <div className="grid items-baseline gap-2 md:grid-cols-3">
              <p className="text-sm">Text small</p>
              <div className="text-sm text-gray-500 md:text-center">14px / 20px / 400</div>
              <div className="flex flex-wrap gap-1 md:justify-end">
                <code className="bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  text-sm
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div>
          <DividerHeading as={'h2'}>Buttons</DividerHeading>
          <div className="mt-12 space-y-8">
            <div className="flex flex-col flex-wrap justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <Button>Button</Button>
              </div>
              <div className="space-x-2 md:col-span-2 md:text-right">
                <code className="rounded bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {'<Button>Button</Button>'}
                </code>
              </div>
            </div>

            <div className="flex flex-col flex-wrap justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <Button variant="link">Button as link</Button>
              </div>
              <div className="space-x-2 md:col-span-2 md:text-right">
                <code className="rounded bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {'<Button variant="link">Button as link</Button>'}
                </code>
              </div>
            </div>

            <div className="flex flex-col flex-wrap justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <Link to="/design-system">Link</Link>
              </div>
              <div className="space-x-2 md:col-span-2 md:text-right">
                <code className="rounded bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {'<Link to="/">Link</Link>'}
                </code>
              </div>
            </div>

            <div className="flex flex-col flex-wrap justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <Link variant="button" to="/design-system">
                  Link as button
                </Link>
              </div>
              <div className="space-x-2 md:col-span-2 md:text-right">
                <code className="rounded bg-gray-200 px-1 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {'<Link variant="button" to="/">Link as button</Link>'}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Textfields */}
        <div>
          <DividerHeading as={'h2'}>Text fields</DividerHeading>
          <div className="mt-12 space-y-12">
            <div className="grid gap-1">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Smash burger..." />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={4} placeholder="Smash burger..." />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="mealType">Meal type</Label>
              <Select id="mealType">
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
