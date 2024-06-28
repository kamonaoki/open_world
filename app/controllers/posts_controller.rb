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
      redirect_to posts_url, notice: 'Post was successfully created.'
    else
      render :new
    end
  end

  private

  def post_params
    params.require(:post).permit(:title, :description, :latitude, :longitude, :image)
  end
end