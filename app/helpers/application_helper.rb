module ApplicationHelper
	
  def human_boolean(boolean)
    boolean ? 'Yes' : 'No'
  end

  def r(value)

    keys_with_values = value.split('.')
    keys = keys_with_values
    last_key = keys.join('.')

    if $redis.hexists 'en', last_key
      if ($redis.hget I18n.locale, last_key).blank?
        if ($redis.hget 'en', last_key).blank?
          return keys_with_values.last.tr("_"," ").capitalize
        else
          return ($redis.hget 'en', last_key)
        end
      else
        return $redis.hget I18n.locale, last_key
      end
    else
      filled_keys = ['navigation'] + keys

      filled_keys.each_with_index do |key, index|
    
          if ! $redis.hexists (filled_keys.take(index)).join('.'), filled_keys[index]
            if index < filled_keys.length - 1
              $redis.hset (filled_keys.take(index)).join('.'), filled_keys[index], ''
            else
              $redis.hset (filled_keys.take(index)).join('.'), filled_keys[index], 'executableitem'
            end
          end
      end

      $redis.hset 'en', last_key, keys_with_values.last.tr("_"," ").capitalize

      return keys_with_values.last.tr("_"," ").capitalize
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
