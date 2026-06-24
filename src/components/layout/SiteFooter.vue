<template>
  <footer class="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
    <div class="mx-auto max-w-6xl px-[var(--space-page-x)] py-8 text-sm leading-7 text-[var(--color-muted)]">
      <p>
        TJHub 是由学生自发维护的非官方校园信息导航项目，不代表同济大学官方立场。
        站内部分链接指向第三方网站，请自行判断信息准确性与安全性。
      </p>
      <div class="mt-4 flex flex-wrap gap-3">
        <RouterLink class="rounded-[var(--radius-control)] px-2 py-1 text-[var(--color-text-soft)] hover:bg-[var(--color-surface-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]" to="/contribute">提交反馈</RouterLink>
        <RouterLink class="rounded-[var(--radius-control)] px-2 py-1 text-[var(--color-text-soft)] hover:bg-[var(--color-surface-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]" to="/about">项目说明</RouterLink>
        <RouterLink class="rounded-[var(--radius-control)] px-2 py-1 text-[var(--color-text-soft)] hover:bg-[var(--color-surface-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--color-focus)]" to="/admin">后台入口</RouterLink>
      </div>
    </div>
  </footer>
</template>
