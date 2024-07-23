class CommentsController < ApplicationController
 
  def create
    @post = Post.find(params[:post_id])
    @comment = @post.comments.build(comment_params)
    @comment.user = current_user

    if @comment.save
      redirect_to @post
    else
      redirect_to @post
    end
  end

  def destroy
    @post = Post.find(params[:post_id])
    @comment = @post.comments.find(params[:id])
    if @comment.user == current_user
      @comment.destroy
      redirect_to @post, notice: 'コメントが削除されました。'
    else
      redirect_to @post, alert: 'コメントの削除に失敗しました。'
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:text)
  end
end
