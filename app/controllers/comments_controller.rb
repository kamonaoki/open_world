class CommentsController < ApplicationController
  def index
    @post = Post.find(params[:post_id])
    @comments = @post.comments.includes(:user)
    render json: @comments.to_json(include: { user: { only: [:id, :name] } })
  end

  def create
    @post = Post.find(params[:post_id])
    @comment = @post.comments.build(comment_params)
    @comment.user = current_user

    if @comment.save
      render json: { status: 'success', comment: @comment, user_name: current_user.name }
    else
      render json: { status: 'error', errors: @comment.errors.full_messages }
    end
  end

  def destroy
    @post = Post.find(params[:post_id])
    @comment = @post.comments.find(params[:id])
    if @comment.user == current_user
      @comment.destroy
      render json: { status: 'success', message: 'コメントが削除されました。' }
    else
      render json: { status: 'error', message: 'コメントの削除に失敗しました。' }
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:text)
  end
end
