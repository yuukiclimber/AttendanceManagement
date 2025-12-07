# ベースイメージ
# Node.js 20（LTS版）
# npm
# TypeScript（tsc）
# Git：ターミナルでのgitコマンド実行
# 基本的な開発ツール
# VS Code拡張機能との連携設定
FROM mcr.microsoft.com/devcontainers/typescript-node:20

# nodeユーザーとして実行
# ベースイメージによって使用するユーザー名が異なるため、合わせる必要があります 
USER node

# PATHにmiseを追加（先に設定しておく）
ENV PATH="${PATH}:/home/node/.local/bin:/home/node/.local/share/mise/shims"

# miseのインストールとbashrc設定
RUN curl https://mise.run | bash \
    && echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc

WORKDIR /workspaces
