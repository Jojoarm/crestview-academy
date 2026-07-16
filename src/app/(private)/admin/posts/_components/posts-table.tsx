'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  Search,
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Send,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, formatDate, getInitials } from '@/lib/utils';
import { usePosts, usePublishPost } from '@/hooks/admin/use-posts';
import { useDebounce } from '@/hooks/use-debounce';
import { ApiError } from '@/lib/api-client';
import {
  POST_TYPES,
  POST_TYPE_COLORS,
  POST_STATUS_COLORS,
  POST_AUDIENCES,
  type Post,
  type PostType,
  type PostAudience,
  type PostStatus,
} from '@/types/post';
import { PostFormSheet } from './post-form-sheet';
import { DeletePostDialog } from './delete-post-dialog';
import { Pagination } from '@/components/Pagination';

export function PostsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState<PostType | ''>('');
  const [status, setStatus] = useState<PostStatus | ''>('');
  const [audience, setAudience] = useState<PostAudience | ''>('');
  const debouncedSearch = useDebounce(search, 500);

  const [formSheetOpen, setFormSheetOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);

  const { data, isLoading } = usePosts({
    search: debouncedSearch,
    type,
    status,
    audience,
    page,
    limit: 15,
  });

  const posts = data?.data ?? [];
  const meta = data?.meta;

  function PublishButton({ post }: { post: Post }) {
    const publishPost = usePublishPost(post.id);

    async function handlePublish() {
      try {
        await publishPost.mutateAsync();
        toast.success(
          post.status === 'Published' ? 'Post unpublished' : 'Post published',
        );
      } catch (error) {
        toast.error(
          error instanceof ApiError ? error.message : 'Failed to update post',
        );
      }
    }

    return (
      <DropdownMenuItem
        onClick={handlePublish}
        className={cn(
          'font-body cursor-pointer',
          post.status === 'Draft'
            ? 'text-emerald-600 focus:text-emerald-600'
            : 'text-amber-600 focus:text-amber-600',
        )}
      >
        {post.status === 'Draft' ? (
          <>
            <Send className="size-4" />
            Publish
          </>
        ) : (
          <>
            <Eye className="size-4" />
            Unpublish
          </>
        )}
      </DropdownMenuItem>
    );
  }

  const columns: ColumnDef<Post>[] = [
    {
      header: 'Post',
      cell: ({ row }) => {
        const post = row.original;
        return (
          <div className="min-w-0 max-w-72">
            <p className="font-body text-sm font-medium text-foreground truncate">
              {post.title}
            </p>
            <p className="font-body text-xs text-muted-foreground truncate mt-0.5">
              {post.content}
            </p>
          </div>
        );
      },
    },
    {
      header: 'Type',
      cell: ({ row }) => (
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
            POST_TYPE_COLORS[row.original.type],
          )}
        >
          {row.original.type}
        </span>
      ),
    },
    {
      header: 'Audience',
      cell: ({ row }) => (
        <span className="font-body text-sm text-muted-foreground">
          {row.original.audience}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: ({ row }) => (
        <span
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded text-xs font-body font-medium',
            POST_STATUS_COLORS[row.original.status],
          )}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      header: 'Author',
      cell: ({ row }) => {
        const author = row.original.author.user;
        return (
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-full bg-deep-violet text-primary-foreground flex items-center justify-center text-xs font-body font-medium shrink-0">
              {getInitials(author.name)}
            </div>
            <p className="font-body text-xs text-muted-foreground truncate max-w-24">
              {author.name}
            </p>
          </div>
        );
      },
    },
    {
      header: 'Date',
      cell: ({ row }) => {
        const post = row.original;
        return (
          <p className="font-body text-xs text-muted-foreground">
            {post.publishedAt
              ? formatDate(post.publishedAt)
              : formatDate(post.createdAt)}
          </p>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const post = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 hover:bg-muted"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-background border-border shadow-lg"
            >
              <DropdownMenuItem
                onClick={() => {
                  setEditingPost(post);
                  setFormSheetOpen(true);
                }}
                className="font-body cursor-pointer"
              >
                <Pencil className="size-4" />
                Edit
              </DropdownMenuItem>
              <PublishButton post={post} />
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeletingPost(post)}
                className="font-body cursor-pointer text-red-600 focus:text-white"
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Card className="p-4">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 pb-4 mb-4 border-b border-border/30 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-48 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-9 border-border font-body text-sm"
              />
            </div>

            <Select
              value={type || 'all'}
              onValueChange={(v) => {
                setType(v === 'all' ? '' : (v as PostType));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-36 h-9 border-border font-body text-sm">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border shadow-lg">
                <SelectItem value="all" className="font-body">
                  All Types
                </SelectItem>
                {POST_TYPES.map((t) => (
                  <SelectItem key={t} value={t} className="font-body">
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={status || 'all'}
              onValueChange={(v) => {
                setStatus(v === 'all' ? '' : (v as PostStatus));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-32 h-9 border-border font-body text-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border shadow-lg">
                <SelectItem value="all" className="font-body">
                  All Status
                </SelectItem>
                <SelectItem value="Draft" className="font-body">
                  Draft
                </SelectItem>
                <SelectItem value="Published" className="font-body">
                  Published
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={audience || 'all'}
              onValueChange={(v) => {
                setAudience(v === 'all' ? '' : (v as PostAudience));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-36 h-9 border-border font-body text-sm">
                <SelectValue placeholder="All Audiences" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border shadow-lg">
                <SelectItem value="all" className="font-body">
                  All Audiences
                </SelectItem>
                {POST_AUDIENCES.map((a) => (
                  <SelectItem key={a} value={a} className="font-body">
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => {
              setEditingPost(null);
              setFormSheetOpen(true);
            }}
            className="h-9 bg-primary hover:bg-accent text-primary-foreground font-body shrink-0"
          >
            <Plus className="size-4" />
            New Post
          </Button>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow
                key={hg.id}
                className="border-border/30 hover:bg-transparent"
              >
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-body font-semibold text-xs capitalize tracking-wide text-muted-foreground h-10"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i} className="border-border/30">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center font-body text-sm text-muted-foreground"
                >
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-border/30 hover:bg-background"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {meta && (
          <Pagination
            page={page}
            totalPages={meta.totalPages}
            total={meta.total}
            limit={meta.limit}
            onPageChange={setPage}
          />
        )}
      </Card>

      <PostFormSheet
        open={formSheetOpen}
        onOpenChange={(open) => {
          setFormSheetOpen(open);
          if (!open) setEditingPost(null);
        }}
        post={editingPost}
      />

      <DeletePostDialog
        post={deletingPost}
        onClose={() => setDeletingPost(null)}
      />
    </>
  );
}
