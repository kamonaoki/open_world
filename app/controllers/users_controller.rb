class UsersController < ApplicationController
  def show
    @user = User.find(params[:id])
    @posts = @user.posts.order('created_at DESC')
  end

  def update
    @user = User.find(params[:id])
    if @user.update(user_params)
      redirect_to user_path（current_user）, notice: 'Profile was successfully updated.'
    else
      render :edit
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :profile, :email, :password, :password_confirmation, :avatar)
  end
end