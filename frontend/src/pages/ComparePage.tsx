import PageContainer from '../components/layout/PageContainer'
import { ComparisonProvider } from '../context/ComparisonContext'
import ComparisonBuilder from '../components/comparison/ComparisonBuilder'
import ComparisonPanel from '../components/comparison/ComparisonPanel'

export default function ComparePage() {
  return (
    <ComparisonProvider>
      <PageContainer>
        <h1 className="mb-6 text-3xl font-bold">Compare Players</h1>
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="w-full shrink-0 lg:w-80">
            <div className="rounded-xl border border-border bg-bg-card p-4">
              <ComparisonBuilder />
            </div>
          </div>
          <div className="flex-1">
            <ComparisonPanel />
          </div>
        </div>
      </PageContainer>
    </ComparisonProvider>
  )
}
