import React, { Component } from "react"
import SearchIcon from "@mui/icons-material/Search"
import CloseIcon from "@mui/icons-material/Close"

interface SearchProps {
  placeholder?: string
}

interface SearchState {
  query: string
}

class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props)
    this.state = {
      query: "",
    }
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: event.target.value })
  }

  render() {
    return (
      <div className="relative inline-flex items-center">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-500" />
        <input
          className="appearance-none border-2 border-gray-300 hover:border-gray-400 transition-colors rounded-md w-full py-2 pl-10 pr-10 text-gray-800 leading-tight focus:outline-none focus:ring-purple-600 focus:border-purple-600 focus:shadow-outline"
          type="text"
          placeholder={this.props.placeholder || "Search..."}
          value={this.state.query}
          onChange={this.handleChange}
        />
        <CloseIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-500" />
      </div>
    )
  }
}

export default Search
