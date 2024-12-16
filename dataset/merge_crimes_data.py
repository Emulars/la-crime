import pandas as pd

def merge_csv_files(file1, file2, output_file):
    """
    Merges two CSV files with identical column structures and removes duplicate rows.

    Parameters:
        file1 (str): Path to the first CSV file.
        file2 (str): Path to the second CSV file.
        output_file (str): Path to save the merged CSV file.

    Returns:
        None
    """
    try:
        # Load the CSV files into Pandas DataFrames
        df1 = pd.read_csv(file1, sep='\t')
        df2 = pd.read_csv(file2, sep='\t')

        # Combine the DataFrames
        merged_df = pd.concat([df1, df2])

        # Remove rows with DateTime in the year 2024
        merged_df = merged_df[~merged_df['DateTime'].str.contains("^2024", na=False)]

        # Drop duplicate rows
        merged_df = merged_df.drop_duplicates()

        # Save the merged DataFrame to a new TSV file
        merged_df.to_csv(output_file, sep='\t', index=False)

        print(f"Merged file saved as: {output_file}")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage
if __name__ == "__main__":
    file1 = "Crime-Data-from-2010-to-2019-csv.tsv"  # Replace with the path to your first CSV file
    file2 = "Crime-Data-from-2020-to-Present-Cleaned.tsv"  # Replace with the path to your second CSV file
    output_file = "crime-data-2010-2024.tsv"  # Replace with the desired output file name

    merge_csv_files(file1, file2, output_file)
