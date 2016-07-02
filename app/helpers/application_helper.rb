module ApplicationHelper
	
  def human_boolean(boolean)
    boolean ? 'Yes' : 'No'
  end

  def r(value)
  	if $redis.hexists 'en', value
  		if ($redis.hget I18n.locale, value).blank?
  			if ($redis.hget 'en', value).blank?
  				return value
  			else
  				return ($redis.hget 'en', value)
  			end
		else
			return $redis.hget I18n.locale, value
		end
  	else
  	    $redis.hset 'en', value, ''
  	    return value
  	end
  end

  def path_exists?(path)
    begin
      Rails.application.routes.recognize_path(path)
    rescue
      return false
    end

    true
  end

end
