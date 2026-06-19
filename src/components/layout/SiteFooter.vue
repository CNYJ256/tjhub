<template>
  <footer class="border-t border-slate-200 bg-white">
    <div class="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-600">
      <p>
        TJHub 是由学生自发维护的非官方校园信息导航项目，不代表同济大学官方立场。
        站内部分链接指向第三方网站，请自行判断信息准确性与安全性。
      </p>
      <div class="mt-4 flex flex-wrap gap-4">
        <RouterLink to="/contribute">提交反馈</RouterLink>
        <RouterLink to="/about">项目说明</RouterLink>
        <RouterLink to="/admin">后台入口</RouterLink>
      </div>
    </div>
  </footer>
</template>
