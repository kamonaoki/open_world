class PostsController < ApplicationController
  def index
    @posts = Post.all
    @post = Post.new
    respond_to do |format|
      format.html
      format.json { render json: @posts.map { |post| post.as_json.merge(image_url: url_for(post.image)) } }
    end
  end

  def new
    @post = Post.new
  end

  def create
    @post = Post.new(post_params)
    if @post.save
      if params[:post][:image].present?
        @post.image.attach(params[:post][:image])
      end
      render json: { status: 'success', post: @post, redirect_url: posts_path }
    else
      render json: { status: 'error', errors: @post.errors.full_messages }
    end
  end

  private

  def post_params
    params.require(:post).permit(:title, :description, :latitude, :longitude, :image)
  end
end
