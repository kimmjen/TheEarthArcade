import { getTableData, getSeasons } from "@/lib/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Database, Table as TableIcon, Filter } from "lucide-react";
import Image from "next/image";

export const revalidate = 0;

const KNOWN_TABLES = [
    'seasons',
    'cast_members',
    'season_cast',
    'ratings',
    'season_videos',
    'season_images',
    'mascots',
    'season_mascots',
    'social_platforms'
];

export default async function DatabasePage({
    searchParams,
}: {
    searchParams: Promise<{ table?: string; page?: string; season?: string }>;
}) {
    const params = await searchParams;
    const activeTable = params?.table || KNOWN_TABLES[0];
    const page = Number(params?.page) || 1;
    const seasonFilter = params?.season || 'all';
    const pageSize = 50;

    const seasons = await getSeasons();
    const { data, count, error } = await getTableData(activeTable, page, pageSize, seasonFilter);

    const totalPages = count ? Math.ceil(count / pageSize) : 1;

    // Dynamic Columns
    const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

    // Helper to render cell content
    const renderCell = (key: string, value: any) => {
        if (!value) return <span className="text-zinc-600">-</span>;

        const strVal = String(value);

        // Image Detection
        if ((key.includes('image') || key.includes('thumbnail') || key.includes('url') || key.includes('poster')) &&
            (strVal.startsWith('http') && (strVal.match(/\.(jpeg|jpg|gif|png|webp)$/) != null || strVal.includes('supabase')))) {
            return (
                <div className="relative w-12 h-12 bg-zinc-900 rounded border border-zinc-800 overflow-hidden group">
                    <Image src={strVal} alt={key} fill className="object-cover" />
                </div>
            );
        }

        // YouTube/Link Detection
        if ((key.includes('url') || key.includes('link')) && strVal.startsWith('http')) {
            return (
                <a href={strVal} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline underline-offset-4 truncate max-w-[200px] block">
                    {strVal}
                </a>
            );
        }

        if (typeof value === 'object') return JSON.stringify(value);
        if (strVal.length > 50) return <span title={strVal}>{strVal.substring(0, 50)}...</span>;
        return strVal;
    };

    return (
        <div className="h-full bg-zinc-950 text-zinc-100 flex overflow-hidden">
            {/* Sidebar for Tables */}
            <aside className="w-64 border-r border-zinc-800 bg-zinc-900/20 p-4 hidden md:flex flex-col overflow-y-auto">
                <div className="flex items-center gap-2 mb-6 px-2 flex-shrink-0">
                    <Database className="w-5 h-5 text-zinc-400" />
                    <h2 className="font-bold text-white">Tables</h2>
                </div>
                <div className="space-y-1">
                    {KNOWN_TABLES.map((table) => (
                        <Link key={table} href={`/admin/tables?table=${table}&page=1&season=${seasonFilter}`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`w-full justify-start ${activeTable === table ? "bg-zinc-800 text-white" : "text-zinc-400"}`}
                            >
                                <TableIcon className="w-4 h-4 mr-2" />
                                {table}
                            </Button>
                        </Link>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 flex flex-col h-full overflow-hidden">
                <div className="mb-4 flex flex-col gap-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-1">{activeTable}</h1>
                            <p className="text-zinc-400 text-sm">
                                Total {count || 0} rows. Page {page} of {totalPages}.
                                {error && <span className="text-red-500 ml-2">Error: {error.message}</span>}
                            </p>
                        </div>

                        {/* Season Filter */}
                        <div className="flex items-center gap-2">
                            <div className="flex items-center bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                                <Link href={`/admin/tables?table=${activeTable}&page=1&season=all`}>
                                    <Button size="sm" variant={seasonFilter === 'all' ? 'secondary' : 'ghost'} className="h-7 text-xs">All</Button>
                                </Link>
                                {seasons.map(s => (
                                    <Link key={s.id} href={`/admin/tables?table=${activeTable}&page=1&season=${s.id}`}>
                                        <Button size="sm" variant={seasonFilter === s.id ? 'secondary' : 'ghost'} className="h-7 text-xs">{s.title}</Button>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/tables?table=${activeTable}&page=${page > 1 ? page - 1 : 1}&season=${seasonFilter}`}>
                            <Button variant="outline" size="sm" disabled={page <= 1}>
                                Previous
                            </Button>
                        </Link>
                        <Link href={`/admin/tables?table=${activeTable}&page=${page < totalPages ? page + 1 : totalPages}&season=${seasonFilter}`}>
                            <Button variant="outline" size="sm" disabled={page >= totalPages}>
                                Next
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex-1 border border-zinc-800 rounded-lg bg-zinc-900/50 overflow-hidden flex flex-col min-h-0">
                    <div className="flex-1 overflow-auto">
                        <div className="min-w-full inline-block align-middle">
                            <table className="min-w-full divide-y divide-zinc-800">
                                <thead className="bg-zinc-900 sticky top-0 z-10">
                                    <tr>
                                        {columns.length > 0 ? columns.map((col) => (
                                            <th
                                                key={col}
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider whitespace-nowrap bg-zinc-900"
                                            >
                                                {col}
                                            </th>
                                        )) : (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">
                                                No Data
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800 bg-zinc-950/50">
                                    {data?.map((row: any, idx: number) => (
                                        <tr key={idx} className="hover:bg-zinc-900/50 transition-colors">
                                            {columns.map((col) => (
                                                <td key={`${idx}-${col}`} className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                                                    {renderCell(col, row[col])}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                    {(!data || data.length === 0) && (
                                        <tr>
                                            <td colSpan={columns.length || 1} className="px-6 py-12 text-center text-zinc-500">
                                                Empty table
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
